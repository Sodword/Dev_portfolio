require('dotenv').config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({
    message: 'My first API is working!'
  });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  const missingFields = ['name', 'email', 'subject', 'message'].filter(field => {
    return typeof req.body?.[field] !== 'string' || !req.body[field].trim();
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Please provide: ${missingFields.join(', ')}.`
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      error: 'Please provide a valid email address.'
    });
  }

  const contactData = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim()
  };

  const { error } = await supabase
    .from('contact_messages')
    .insert(contactData);

  if (error) {
    console.error('Failed to save contact form submission:', error);

    return res.status(500).json({
      error: 'Failed to save your message. Please try again later.'
    });
  }

  console.log('Contact form submission received:', contactData);

  return res.status(200).json({
    message: 'Your message was received successfully.'
  });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Request body must contain valid JSON.'
    });
  }

  next(error);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

