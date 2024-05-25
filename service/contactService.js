const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Contact = require('../model/contact');

const identify = async ({ email, phoneNumber }) => {
  try {
    return await sequelize.transaction(async (t) => {
      const searchCriteria = {
        [Op.or]: [],
        deletedAt: null,
      };

      if (email !== null) searchCriteria[Op.or].push({ email });
      if (phoneNumber !== null) searchCriteria[Op.or].push({ phoneNumber });

      const matchedContacts = await Contact.findAll({
        where: searchCriteria,
        transaction: t,
      });

      let primaryContact = matchedContacts.find((c) => c.linkPrecedence === 'primary');

      if (!primaryContact) {
        primaryContact = await findExistingPrimaryFromSecondaries(matchedContacts, t);
        if (!primaryContact) {
          return await createNewPrimaryContact(email, phoneNumber, t);
        }
      }

      // Evaluate if any contact needs to be relinked to the primary
      const shouldRelinkToSecondary = matchedContacts.some((contact) => contact.id !== primaryContact.id
               && (contact.linkPrecedence !== 'secondary' || contact.linkedId !== primaryContact.id));

      if (shouldRelinkToSecondary) {
        primaryContact = await relinkToSecondary(primaryContact, matchedContacts, t);
      }

      const secondaryContacts = await findSecondaryContacts(primaryContact.id, t);

      // Create a new secondary contact if necessary
      const existingEmails = new Set(secondaryContacts.map((c) => c.email).filter(Boolean));
      const existingPhoneNumbers = new Set(secondaryContacts.map((c) => c.phoneNumber).filter(Boolean));

      if ((email && !existingEmails.has(email) && email !== primaryContact.email)
          || (phoneNumber && !existingPhoneNumbers.has(phoneNumber) && phoneNumber !== primaryContact.phoneNumber)) {
        await createNewSecondaryContact(primaryContact.id, email, phoneNumber, t);
      }

      const updatedSecondaryContacts = await findSecondaryContacts(primaryContact.id, t);
      return formatContactResponse(primaryContact, updatedSecondaryContacts);
    });
  } catch (error) {
    console.error('Failed to process identify request:', error);
    throw new Error('Internal server error');
  }
};

const findExistingPrimaryFromSecondaries = async (secondaries, transaction) => {
  for (const sec of secondaries) {
    if (sec.linkPrecedence === 'secondary') {
      const primary = await Contact.findByPk(sec.linkedId, { transaction });
      if (primary && primary.deletedAt === null) {
        return primary;
      }
    }
  }
  return null;
};

const relinkToSecondary = async (oldestPrimaryContact, matchedContacts, transaction) => {
  for (const contact of matchedContacts) {
    if (contact.id !== oldestPrimaryContact.id) {
      // Check if the contact needs to be relinked as a secondary
      if (contact.linkPrecedence !== 'secondary' || contact.linkedId !== oldestPrimaryContact.id) {
        // Update to secondary if it's not already or if it's not linked correctly
        contact.linkPrecedence = 'secondary';
        contact.linkedId = oldestPrimaryContact.id;
        await contact.save({ transaction });
      }
    }
  }
  return oldestPrimaryContact; // Return the primary contact regardless of changes
};

const findSecondaryContacts = async (primaryId, transaction) => Contact.findAll({
  where: {
    linkedId: primaryId,
    linkPrecedence: 'secondary',
    deletedAt: null,
  },
  transaction,
});

const createNewPrimaryContact = async (email, phoneNumber, transaction) => {
  const newContact = await Contact.create({
    email: email || undefined,
    phoneNumber: phoneNumber || undefined,
    linkPrecedence: 'primary',
  }, { transaction });
  return formatContactResponse(newContact, []);
};

const createNewSecondaryContact = async (primaryId, email, phoneNumber, transaction) => {
  await Contact.create({
    email: email || undefined,
    phoneNumber: phoneNumber || undefined,
    linkedId: primaryId,
    linkPrecedence: 'secondary',
  }, { transaction });
};

const formatContactResponse = (primaryContact, secondaryContacts) => {
  const emailSet = new Set([primaryContact.email]);
  const phoneSet = new Set([primaryContact.phoneNumber]);
  secondaryContacts.forEach((contact) => {
    if (contact.email) emailSet.add(contact.email);
    if (contact.phoneNumber) phoneSet.add(contact.phoneNumber);
  });
  return {
    status: 200,
    data: {
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emailSet),
        phoneNumbers: Array.from(phoneSet),
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    },
  };
};

module.exports = { identify };
