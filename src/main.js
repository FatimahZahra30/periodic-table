import './style.css';

import * as THREE from 'three';

import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import {
    CSS3DRenderer,
    CSS3DObject
} from 'three/addons/renderers/CSS3DRenderer.js';

// Google Sign-In
const GOOGLE_CLIENT_ID = '737224434204-oes65iqibb5oqri048i7f9if2cvnv4cb.apps.googleusercontent.com';

const SPREADSHEET_ID = '1LsnaTrS5dy2QevJK0VLxyqUAIqKUb8coGQyUcN79gl8';
const SHEET_RANGE = 'Data Template!A1:F201';

window.onload = () => {

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

   google.accounts.id.renderButton(
		document.getElementById('google-button'),
		{
			theme: 'filled_blue',
			size: 'large'
		}
	);

};

async function handleCredentialResponse(response) {
    console.log("Google login successful!");

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-screen").style.display = "block";

    try {
        people = await loadSheetData();

        console.log("People:", people);
        console.log("Number of people:", people.length);

        init();
        animate();

    } catch (error) {
        console.error("Could not load Google Sheet:", error);
    }
}

async function loadSheetData() {
    const url =
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=Data%20Template`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load Google Sheet: ${response.status}`);
    }

    const text = await response.text();

    const json = JSON.parse(
        text.substring(47, text.length - 2)
    );

    const people = json.table.rows.map(row => ({
        name: row.c[0]?.v ?? '',
        photo: row.c[1]?.v ?? '',
        age: Number(row.c[2]?.v ?? 0),
        country: row.c[3]?.v ?? '',
        interest: row.c[4]?.v ?? '',
        netWorth: Number(
            String(row.c[5]?.v ?? '0').replace(/[$,]/g, '')
        )
    }));

    console.log("Parsed people:", people);
    console.log("Number of people:", people.length);

    return people;
}

			let camera, scene, renderer;
			let controls;

      let people = [];

      const objects = [];
      const targets = { table: [], sphere: [], helix: [], grid: [] };

			function init() {

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 3000;

				scene = new THREE.Scene();

				// table

        for (let i = 0; i < people.length; i++) {

            const person = people[i];

            const element = document.createElement('div');
            element.className = 'element';

            // Background colour based on Net Worth
            if (person.netWorth < 100000) {
                element.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
                element.style.border = '1px solid rgba(255, 0, 0, 0.8)';
                element.style.boxShadow = '0px 0px 12px rgba(255, 0, 0, 0.5)';
            } else if (person.netWorth < 200000) {
                element.style.backgroundColor = 'rgba(255, 165, 0, 0.5)';
                element.style.border = '1px solid rgba(255, 165, 0, 0.8)';
                element.style.boxShadow = '0px 0px 12px rgba(255, 165, 0, 0.5)';
            } else {
                element.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
                element.style.border = '1px solid rgba(0, 128, 0, 0.8)';
                element.style.boxShadow = '0px 0px 12px rgba(0, 128, 0, 0.5)';
            }

            const country = document.createElement('div');
            country.className = 'country';
            country.textContent = person.country;
            element.appendChild(country);

            const age = document.createElement('div');
            age.className = 'age';
            age.textContent = person.age;
            element.appendChild(age);

            const details = document.createElement('div');
            details.className = 'details';

            details.innerHTML =
                `<img src="${person.photo}" alt="${person.name}">` +
                `<div class="name">${person.name}</div>` +
                `<div class="interest">${person.interest}</div>`;

            element.appendChild(details);

            const objectCSS = new CSS3DObject(element);

            objectCSS.position.x = Math.random() * 4000 - 2000;
            objectCSS.position.y = Math.random() * 4000 - 2000;
            objectCSS.position.z = Math.random() * 4000 - 2000;

            scene.add(objectCSS);
            objects.push(objectCSS);

            // 20 x 10 table
            const object = new THREE.Object3D();

            object.position.x = (i % 20) * 140 - 1330;
            object.position.y = -(Math.floor(i / 20) * 180) + 810;

            targets.table.push(object);
        }

				// sphere

				const vector = new THREE.Vector3();

				for ( let i = 0, l = objects.length; i < l; i ++ ) {

					const phi = Math.acos( - 1 + ( 2 * i ) / l );
					const theta = Math.sqrt( l * Math.PI ) * phi;

					const object = new THREE.Object3D();

					object.position.setFromSphericalCoords( 800, phi, theta );

					vector.copy( object.position ).multiplyScalar( 2 );

					object.lookAt( vector );

					targets.sphere.push( object );

				}

				// double helix

				for (let i = 0; i < objects.length; i++) {

					const strand = i % 2;
					const index = Math.floor(i / 2);

					// Fewer turns = more obvious DNA shape
					const theta = index * 0.18 + (strand * Math.PI);

					// Spread the cards vertically
					const y = 900 - (index * 22);

					const object = new THREE.Object3D();

					// Distance between the two strands
					const radius = 850;

					object.position.x = Math.cos(theta) * radius;
					object.position.y = y;
					object.position.z = Math.sin(theta) * radius;

					// Face outward
					vector.x = object.position.x * 2;
					vector.y = object.position.y;
					vector.z = object.position.z * 2;

					object.lookAt(vector);

					targets.helix.push(object);
				}

				// grid

				// 5 x 4 x 10 grid

				for (let i = 0; i < objects.length; i++) {

					const object = new THREE.Object3D();

					const x = i % 5;
					const y = Math.floor(i / 5) % 4;
					const z = Math.floor(i / 20);

					object.position.x = (x * 300) - 600;
					object.position.y = -(y * 300) + 450;
					object.position.z = (z * 500) - 2250;

					targets.grid.push(object);

				}

				//

				renderer = new CSS3DRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.getElementById( 'container' ).appendChild( renderer.domElement );

				//

				controls = new TrackballControls( camera, renderer.domElement );
				controls.minDistance = 500;
				controls.maxDistance = 6000;
				controls.addEventListener( 'change', render );

				const buttonTable = document.getElementById( 'table' );
				buttonTable.addEventListener( 'click', function () {

					transform( targets.table, 2000 );

				} );

				const buttonSphere = document.getElementById( 'sphere' );
				buttonSphere.addEventListener( 'click', function () {

					transform( targets.sphere, 2000 );

				} );

				const buttonHelix = document.getElementById( 'helix' );
				buttonHelix.addEventListener( 'click', function () {

					transform( targets.helix, 2000 );

				} );

				const buttonGrid = document.getElementById( 'grid' );
				buttonGrid.addEventListener( 'click', function () {

					transform( targets.grid, 2000 );

				} );

				transform( targets.table, 2000 );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function transform( targets, duration ) {

				TWEEN.removeAll();

				for ( let i = 0; i < objects.length; i ++ ) {

					const object = objects[ i ];
					const target = targets[ i ];

					new TWEEN.Tween( object.position )
						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

					new TWEEN.Tween( object.rotation )
						.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

				}

				new TWEEN.Tween( this )
					.to( {}, duration * 2 )
					.onUpdate( render )
					.start();

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function animate() {

				requestAnimationFrame( animate );

				TWEEN.update();

				controls.update();

			}

			function render() {

				renderer.render( scene, camera );

			}
