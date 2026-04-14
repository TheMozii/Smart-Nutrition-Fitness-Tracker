# Feature Food Logging

## User story

As a user of the Smart Nutrition & Fitness Tracker application, I want to enter the name of a food or scan its barcode, so that I can receive information about its nutritional values.

## Acceptance Criteria (AC)

### AC1 Search food by name
**Given** The user on the food logging screen
**When** The user enters the name of a food and submits the request
**Then** The system shows nutritionsl information about that food

### AC2 Search food by barcode
**Given** The user on the food logging screen and camera available and wait for scaning
**When** The user scans barcode on the food package
**Then** The system shows nutritionsl information about that food

### AC3 Food not found
**Given** The user on the food logging screen
**When** The user scans barcode on the food package or enters name of the food than doesnt exist in the system
**Then** The system shows message that information about this food could't not be found

