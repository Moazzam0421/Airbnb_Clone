function scrollToLeft() {  // Renamed function to avoid conflicts
    const wrapper = document.querySelector('.filter-wrapper');
    wrapper.scrollBy({
        top: 0,
        left: -200,  // Adjust value to control scroll amount
        behavior: 'smooth'
    });
}

function scrollToRight() {  // Renamed function to avoid conflicts
    const wrapper = document.querySelector('.filter-wrapper');
    wrapper.scrollBy({
        top: 0,
        left: 200,  // Adjust value to control scroll amount
        behavior: 'smooth'
    });
}