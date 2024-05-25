const { identify } = require('../service/contactService');

const identifyContact = async (req, res) => {
  try {
    const data = req.body;
    const result = await identify(data);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { identifyContact };
