const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'dummy_key');

const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

const parseJsonResponse = (text) => {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) return JSON.parse(braceMatch[0]);
    return { rawResponse: text };
  } catch {
    return { rawResponse: text };
  }
};

const analyzeSymptoms = async (symptoms) => {
  try {
    const model = getModel();
    const prompt = `You are a medical triage AI assistant. Analyze the following symptoms and provide a JSON response.

Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}

Respond ONLY with a JSON object in this exact format:
{
  "possibleConditions": [
    { "condition": "condition name", "probability": "high/medium/low", "description": "brief description" }
  ],
  "recommendedDepartment": "department name",
  "urgencyLevel": "low/medium/high/emergency",
  "disclaimer": "This is an AI-assisted preliminary analysis. Please consult a qualified healthcare professional for accurate diagnosis."
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return parseJsonResponse(response);
  } catch (error) {
    console.error('AI Symptom Analysis Error:', error.message);
    return {
      possibleConditions: [],
      recommendedDepartment: 'General Medicine',
      urgencyLevel: 'medium',
      disclaimer: 'AI analysis is temporarily unavailable. Please consult a doctor directly.',
      error: 'AI service unavailable',
    };
  }
};

const summarizePatientHistory = async (patientData) => {
  try {
    const model = getModel();
    const prompt = `You are a medical records AI assistant. Summarize the following patient data into a concise clinical summary.

Patient Data:
${JSON.stringify(patientData, null, 2)}

Respond ONLY with a JSON object in this exact format:
{
  "summary": "concise clinical summary paragraph",
  "keyFindings": ["finding 1", "finding 2"],
  "riskFactors": ["risk 1", "risk 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "chronicConditions": ["condition 1"],
  "medicationInteractions": ["interaction note if any"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return parseJsonResponse(response);
  } catch (error) {
    console.error('AI Summary Error:', error.message);
    return {
      summary: 'AI summary is temporarily unavailable.',
      keyFindings: [],
      riskFactors: [],
      recommendations: ['Please review patient records manually.'],
      chronicConditions: [],
      medicationInteractions: [],
      error: 'AI service unavailable',
    };
  }
};

const explainPrescription = async (prescription, question) => {
  try {
    const model = getModel();
    const prompt = `You are a patient-friendly medical AI assistant. A patient has a question about their prescription.

Prescription Details:
${JSON.stringify(prescription, null, 2)}

Patient's Question: ${question || 'Please explain this prescription in simple terms.'}

Respond ONLY with a JSON object in this exact format:
{
  "explanation": "clear, simple language explanation",
  "medicineDetails": [
    {
      "name": "medicine name",
      "purpose": "what it does",
      "howToTake": "instructions in simple language",
      "commonSideEffects": ["side effect 1"],
      "precautions": ["precaution 1"]
    }
  ],
  "generalAdvice": "overall advice for the patient",
  "whenToSeekHelp": "when to contact the doctor"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return parseJsonResponse(response);
  } catch (error) {
    console.error('AI Prescription Explanation Error:', error.message);
    return {
      explanation: 'AI explanation is temporarily unavailable. Please ask your doctor or pharmacist.',
      medicineDetails: [],
      generalAdvice: 'Follow your doctor\'s instructions carefully.',
      whenToSeekHelp: 'Contact your doctor if you experience any unusual symptoms.',
      error: 'AI service unavailable',
    };
  }
};

const assistAppointment = async (query, availableDoctors) => {
  try {
    const model = getModel();
    const prompt = `You are an AI appointment scheduling assistant for a hospital.

Patient's Request: ${query}

Available Doctors:
${JSON.stringify(availableDoctors, null, 2)}

Based on the patient's request, suggest the best doctor and time slot. Respond ONLY with a JSON object in this exact format:
{
  "suggestedDoctors": [
    {
      "doctorName": "name",
      "specialization": "specialization",
      "reason": "why this doctor is recommended",
      "availableSlots": ["slot 1", "slot 2"]
    }
  ],
  "suggestedDepartment": "department name",
  "appointmentType": "regular/follow_up/emergency",
  "additionalNotes": "any helpful notes for the patient"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return parseJsonResponse(response);
  } catch (error) {
    console.error('AI Appointment Assist Error:', error.message);
    return {
      suggestedDoctors: [],
      suggestedDepartment: 'General Medicine',
      appointmentType: 'regular',
      additionalNotes: 'AI assistance is temporarily unavailable. Please contact the reception desk.',
      error: 'AI service unavailable',
    };
  }
};

const analyzeOperations = async (metrics) => {
  try {
    const model = getModel();
    const prompt = `You are a hospital operations analytics AI. Analyze the following hospital metrics and provide actionable insights.

Hospital Metrics:
${JSON.stringify(metrics, null, 2)}

Respond ONLY with a JSON object in this exact format:
{
  "overview": "brief summary of hospital performance",
  "trends": [
    { "metric": "metric name", "trend": "increasing/decreasing/stable", "details": "explanation" }
  ],
  "insights": [
    { "category": "category", "insight": "actionable insight", "priority": "high/medium/low" }
  ],
  "recommendations": [
    { "area": "area of improvement", "suggestion": "specific suggestion", "expectedImpact": "expected impact" }
  ],
  "alerts": ["any critical alerts or concerns"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return parseJsonResponse(response);
  } catch (error) {
    console.error('AI Operations Analysis Error:', error.message);
    return {
      overview: 'AI operations analysis is temporarily unavailable.',
      trends: [],
      insights: [],
      recommendations: [{ area: 'System', suggestion: 'AI service needs to be configured.', expectedImpact: 'N/A' }],
      alerts: ['AI analytics service is currently offline.'],
      error: 'AI service unavailable',
    };
  }
};

module.exports = {
  analyzeSymptoms,
  summarizePatientHistory,
  explainPrescription,
  assistAppointment,
  analyzeOperations,
};
