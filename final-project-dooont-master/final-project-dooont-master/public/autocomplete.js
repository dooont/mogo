let autocomplete;

function initAutoComplete() {
  const input = document.getElementById('address');
  if (!input) {
    console.error("Input element not found!");
    return;
  }
  try {
    autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: {'country': ['US']},
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log(place);
    });
  } catch (error) {
    console.error("Failed to initialize Autocomplete:", error);
  }
}

function fillInAddress() {
  var place = autocomplete.getPlace();
  console.log(place.address_components);
}