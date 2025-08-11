-- Database Backup Script
-- Run this before starting migration

-- Export all table data
\copy users TO 'backup/users_backup.csv' CSV HEADER;
\copy staff_profiles TO 'backup/staff_profiles_backup.csv' CSV HEADER;
\copy travel_packages TO 'backup/travel_packages_backup.csv' CSV HEADER;
\copy bookings TO 'backup/bookings_backup.csv' CSV HEADER;
\copy custom_tour_requests TO 'backup/custom_tour_requests_backup.csv' CSV HEADER;
\copy custom_bookings TO 'backup/custom_bookings_backup.csv' CSV HEADER;
\copy gallery_images TO 'backup/gallery_images_backup.csv' CSV HEADER;
\copy reviews TO 'backup/reviews_backup.csv' CSV HEADER;
\copy system_logs TO 'backup/system_logs_backup.csv' CSV HEADER;

-- Also create a full database dump
-- This should be run from command line:
-- pg_dump DATABASE_URL > backup/full_backup_$(date +%Y%m%d_%H%M%S).sql
