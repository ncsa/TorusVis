
var loadImage = (function() {
    var loader = new THREE.ImageLoader();

    return function loadImage(url) {
        return new Promise(function(rs, rj) {
            loader.load(url, function(image) {
                var texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                rs(texture);
            });
        });
    };
})();

