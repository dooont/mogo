document.addEventListener("DOMContentLoaded", function () {
  // Attach event listener to form to handle submission
  const nameInput = document.getElementById("name").value;
  const addressInput = document.getElementById("address").value;
  const cuisineInput = document.getElementById("cuisine").value;
  const priceInput = document.getElementById("price").value;

  // console.log(nameInput, addressInput, cuisineInput, priceInput);
  let redButton = document.getElementById("neverBeen");
  // redButton.addEventListener('click', handleEvent);
  redButton.addEventListener("click", function(evt) {addToCol(evt, "never")});
  let yellowButton = document.getElementById("goingTo");
  // yellowButton.addEventListener('click', handleEvent);
  yellowButton.addEventListener("click", function(evt) {addToCol(evt, "going")});
  let greenButton = document.getElementById("beenTo");
  // greenButton.addEventListener('click', handleEvent);
  greenButton.addEventListener("click", function(evt) {addToCol(evt, "been")});

  document.getElementById('clearBoard').addEventListener('click', clearBoard);
});

function handleEvent(evt) {
  console.log('button clicked');
    evt.preventDefault();
}

function addToCol(evt, status) {
  const nameInput = document.getElementById("name").value;
  const cuisineInput = document.getElementById("cuisine").value;
  const priceInput = document.getElementById("price").value;
  if (status == "never") {
    const neverDiv = document.getElementById("addNeverBeen");
    const newDiv = createRestaurantDiv(nameInput, cuisineInput, priceInput);
    neverDiv.appendChild(newDiv);
    
  }
  else if (status == "going") { 
    const neverDiv = document.getElementById("addGoingTo");
    const newDiv = createRestaurantDiv(nameInput, cuisineInput, priceInput);
    neverDiv.appendChild(newDiv);
  }
  else {
    const neverDiv = document.getElementById("addBeenTo");
    const newDiv = createRestaurantDiv(nameInput, cuisineInput, priceInput);
    neverDiv.appendChild(newDiv); 
  }
  evt.preventDefault();
}

function createRestaurantDiv(name, cuisine, price) {
  // Create the container div
  const entryDiv = document.createElement('div');
  entryDiv.id = name;
  entryDiv.classList.add('restaurant-entry', 'bg-white', 'border-2', 'border-nyu-purple', 'rounded-md', 'p-2', 'mb-2');
  // console.log('div created')

  // Add restaurant name
  const nameH3 = document.createElement('h3');
  nameH3.classList.add('font-bold', 'text-pastel-purple');
  nameH3.textContent = name;
  entryDiv.appendChild(nameH3);
  // console.log('name added')

  // Add cuisine info
  const cuisineP = document.createElement('p');
  cuisineP.classList.add('text-gray-700');
  cuisineP.innerHTML = `Cuisine: <span class="cuisine">${cuisine}</span>`;
  entryDiv.appendChild(cuisineP);
  // console.log('cuisine added')

  // Add price info
  const priceP = document.createElement('p');
  priceP.classList.add('text-gray-700');
  priceP.innerHTML = `Price: <span class="price">${price}</span>`;
  entryDiv.appendChild(priceP);
  // console.log('price added')

  // Add buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('flex', 'justify-between', 'mt-2');

  // Button to move to 'Never Been'
  const neverBeenButton = document.createElement('button');
  neverBeenButton.classList.add('move-button', 'text-xs', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'font-bold', 'py-1', 'px-2', 'rounded');
  neverBeenButton.textContent = 'Never Been';
  neverBeenButton.id = 'moveButton';
  neverBeenButton.onclick = function() { moveToColumn(name, 'Never Been'); };
  buttonContainer.appendChild(neverBeenButton);

  // Button to move to 'Planning On Going'
  const planToGoButton = document.createElement('button');
  planToGoButton.classList.add('move-button', 'text-xs', 'bg-yellow-500', 'hover:bg-yellow-600', 'text-white', 'font-bold', 'py-1', 'px-2', 'rounded');
  planToGoButton.textContent = 'Plan to Go';
  planToGoButton.id = 'moveButton';
  planToGoButton.onclick = function() { moveToColumn(name, 'Planning On Going'); };
  buttonContainer.appendChild(planToGoButton);

  // Button to move to 'Already Been'
  const alreadyBeenButton = document.createElement('button');
  alreadyBeenButton.classList.add('move-button', 'text-xs', 'bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-1', 'px-2', 'rounded');
  alreadyBeenButton.textContent = 'Already Been';
  alreadyBeenButton.id = 'moveButton';
  alreadyBeenButton.onclick = function() { moveToColumn(name, 'Already Been'); };
  buttonContainer.appendChild(alreadyBeenButton);

  // Button to remove the entry
  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button', 'text-xs', 'bg-gray-500', 'hover:bg-gray-600', 'text-nyu-purple', 'font-bold', 'py-1', 'px-2', 'rounded');
  removeButton.textContent = 'Remove';
  removeButton.onclick = function() { entryDiv.remove(); };
  buttonContainer.appendChild(removeButton);

  // Append the button container to the entry div
  entryDiv.appendChild(buttonContainer);

  return entryDiv;
}

function moveToColumn(name, column) {
  // Find the entry div by ID
  let entryDiv = document.getElementById(name);
  if (entryDiv) {
    console.log('Entry div found');
  } else {
    console.log('Entry div not found');
    return; // Exit the function if the entry div is not found
  }

  let targetColumnId;
  if (column === "Never Been") {
    targetColumnId = "addNeverBeen";
  } else if (column === "Planning On Going") {
    targetColumnId = "addGoingTo";
  } else if (column === "Already Been") {
    targetColumnId = "addBeenTo";
  } else {
    console.log('Column parameter does not match expected values');
    return;
  }
  
  let targetDiv = document.getElementById(targetColumnId);
  if (!targetDiv) {
    console.log('Target column not found');
    return;
  }

  if (entryDiv.parentElement.id === targetColumnId) {
    console.log('Entry is already in the target column');
    return;
  }

  entryDiv.remove();
  targetDiv.appendChild(entryDiv);
}

function clearBoard() {
  const neverParent = document.getElementById('addNeverBeen');
  if (neverParent) {
    Array.from(neverParent.children).map(child => {
      if (child.tagName === 'DIV') {
        neverParent.removeChild(child);
      }
      return null;
    });
  }
  const goingParent = document.getElementById('addGoingTo');
  if (goingParent) {
    Array.from(goingParent.children).map(child => {
      if (child.tagName === 'DIV') {
        goingParent.removeChild(child);
      }
      return null;
    });
  }
  const wentParent = document.getElementById('addBeenTo');
  if (wentParent) {
    Array.from(wentParent.children).map(child => {
      if (child.tagName === 'DIV') {
        wentParent.removeChild(child);
      }
      return null;
    });
  }
}