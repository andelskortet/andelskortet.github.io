// ...Existing JavaScript code...

// Update the latitude and longitude values with your desired coordinates
const latitude = 55.6761;
const longitude = 12.5683;

const circleOverlay = document.querySelector('.circle-overlay');
const mapContainer = document.querySelector('.map-container');

// Calculate the position of the circle overlay based on the map container size and the specified coordinates
function updateCirclePosition() {
  const containerWidth = mapContainer.offsetWidth;
  const containerHeight = mapContainer.offsetHeight;

  const circleSize = Math.min(containerWidth, containerHeight) * 300; // Adjust the size of the circle

  const x = (longitude + 180) * (containerWidth / 360);
  const y = (90 - latitude) * (containerHeight / 180);

  const circleLeft = x - circleSize / 2;
  const circleTop = y - circleSize / 2;

  circleOverlay.style.width = `${circleSize}px`;
  circleOverlay.style.height = `${circleSize}px`;
  circleOverlay.style.left = `${circleLeft}px`;
  circleOverlay.style.top = `${circleTop}px`;
}

window.addEventListener('resize', updateCirclePosition);
updateCirclePosition();

// ...Existing JavaScript code...
