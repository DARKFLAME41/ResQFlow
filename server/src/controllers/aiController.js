const { analyzeEmergency, generateFollowUpQuestions, analyzeImageContent } = require('../services/aiEngine');

function analyzeText(req, res) {
  try {
    const { text, voiceTranscript, type, answers } = req.body;
    const result = analyzeEmergency({ text, voiceTranscript, type, answers });
    res.json({ success: true, aiAnalysis: result });
  } catch (err) {
    res.status(500).json({ error: 'AI Text Analysis Error' });
  }
}

function analyzeImage(req, res) {
  try {
    const { imageBase64, fileName, fileType } = req.body;
    const result = analyzeImageContent(fileName || 'emergency_photo.jpg', fileType || 'image/jpeg');
    res.json({ success: true, imageAnalysis: result });
  } catch (err) {
    res.status(500).json({ error: 'AI Image Analysis Error' });
  }
}

function generateFollowUp(req, res) {
  try {
    const { type, text } = req.body;
    const questions = generateFollowUpQuestions(type || 'General', text || '');
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ error: 'AI Follow-up generation error' });
  }
}

module.exports = {
  analyzeText,
  analyzeImage,
  generateFollowUp
};
