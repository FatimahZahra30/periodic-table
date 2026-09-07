# Interactive Data Visualisation

This project is an interactive 3D data visualisation built using Three.js. The application retrieves data from a Google Sheet and displays each record as a visual card.

Users first sign in using Google before accessing the visualisation. The data can then be viewed in four different arrangements using the buttons at the bottom of the page.

## Features

* Google Sign-In
* Data retrieved from Google Sheets
* Colour coding based on Net Worth
* Four different 3D layouts:

  * Table
  * Sphere
  * Double Helix
  * Grid
* Smooth transitions between layouts
* Interactive camera controls

## Net Worth Colours

The cards are coloured based on the Net Worth value:

* Red: Less than $100,000
* Orange: $100,000 to less than $200,000
* Green: $200,000 or more

## Layouts

### Table

The data is arranged in a 20 × 10 table.

### Sphere

The data is arranged around a 3D sphere.

### Double Helix

The data is arranged along two strands to form a double helix.

### Grid

The data is arranged in a 5 × 4 × 10 3D grid.

## Technologies

* HTML
* CSS
* JavaScript
* Three.js
* Google Identity Services
* Google Sheets

## Running the Project

Install the required dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application can then be accessed through the local URL provided by Vite.

## Deployment

The project is deployed using Vercel.

Live website:

https://periodic-table-three-alpha.vercel.app/

## Credits

This project was developed by modifying the Three.js CSS3D Periodic Table example to display the provided dataset and implement Google Sign-In, Google Sheets integration, custom colour coding and additional visualisation layouts.

Three.js CSS3D Periodic Table example:
https://threejs.org/examples/#css3d_periodictable

Google Identity Services JavaScript API:
https://developers.google.com/identity/gsi/web/reference/js-reference

Google Sheets API JavaScript Quickstart:
https://developers.google.com/workspace/sheets/api/quickstart/js


## AI Acknowledgement

AI tools were used during the development of this project for troubleshooting, understanding technical concepts, and improving documentation. All code was reviewed, tested and modified as necessary.

