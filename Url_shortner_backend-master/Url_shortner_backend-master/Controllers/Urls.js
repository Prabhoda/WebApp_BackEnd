const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

const ShortenUrl = async (req, res) => {
  const { originalUrl, userId } = req.body;
  const shortUrl = uuidv4();
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 48);

  try {
    const result = await pool.query(
      'INSERT INTO shorturls (original_url, short_url, user_id, expiration_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [originalUrl, shortUrl, userId, expirationTime]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating short URL', error);
    res.status(500).send('Internal Server Error');
  }
};

const GetUrls = async (req, res) => {
  const { userId } = req.query;

  try {
    const result = await pool.query(
      'SELECT short_url, original_url, expiration_time FROM shorturls WHERE user_id = $1 AND expiration_time > NOW()',
      [userId]
    );

    const shortUrls = result.rows.map((row) => {
      const remainingHours = calculateRemainingHours(row.expiration_time);
      return {
        short_url: row.short_url,
        original_url: row.original_url,
        remaining_hours: remainingHours,
      };
    });

    res.json(shortUrls);
  } catch (error) {
    console.error('Error fetching short URLs', error);
    res.status(500).send('Internal Server Error');
  }
};

function calculateRemainingHours(expirationTime) {
  const now = new Date();
  const remainingMilliseconds = expirationTime - now;
  const remainingHours = Math.floor(remainingMilliseconds / (60 * 60 * 1000));

  return remainingHours;
}

module.exports = { ShortenUrl, GetUrls };
