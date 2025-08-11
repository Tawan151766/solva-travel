-- Query to examine Travel Packages table structure and data
-- Run this to see the current travel packages in your database

SELECT 
    id,
    name,
    description,
    price,
    duration,
    max_capacity as maxCapacity,
    location,
    category,
    destination,
    difficulty,
    duration_text as durationText,
    is_active as isActive,
    is_recommended as isRecommended,
    rating,
    total_reviews as totalReviews,
    created_at as createdAt,
    updated_at as updatedAt
FROM travel_packages 
ORDER BY created_at DESC;
