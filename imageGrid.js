$.fn.imageGrid = function () {
    var $self = this;

    function getImages($listImageContainer) {
        var result = [];

        $listImageContainer.each(function () {
            var $imageContainer         = $(this);
            var $image                  = $imageContainer.find('img');

            var widthImageContainer     = $imageContainer.outerWidth();
            var heightImageContainer    = $imageContainer.outerHeight();
            var widthImage              = $image.width();
            var heightImage             = $image.height();

            var sizes = {
                widthImageContainer:    widthImageContainer,
                heightImageContainer:   heightImageContainer,
                widthImage:             widthImage,
                heightImage:            heightImage,
                widthStatic:            widthImageContainer - widthImage,
                heightStatic:           heightImageContainer - heightImage
            };

            result.push({
                sizes:  sizes,
                $image: $image
            });
        });

        return result;
    }

    function checkSumImagesWidthImage(split, minImageHeight, imageContainerWidth) {
        var sumWidthGrid = 0;

        split.map(function (image) {
            if (minImageHeight <= image.sizes.heightImage) {
                var widthGrid = image.sizes.widthImage/(image.sizes.heightImage/minImageHeight);

                image.sizes.widthGrid = widthGrid;
                sumWidthGrid += widthGrid;
            }
        });

        if (sumWidthGrid < imageContainerWidth) {
            return false;
        }

        return true;
    }

    function getSplitImages(imageContainerWidth, images) {
        var result                  = [];
        var split                   = [];

        var imagesCount             = images.length;
        var sumImagesWidthImage     = 0;
        var sumImagesWidthStatic    = 0;
        var minImageHeight          = 9999;

        images.map(function (image, iterator) {
            sumImagesWidthImage += image.sizes.widthImage;
            sumImagesWidthStatic += image.sizes.widthStatic;

            if (minImageHeight > image.sizes.heightImage) {
                minImageHeight = image.sizes.heightImage;
            }

            split.push({
                sizes: image.sizes,
                $image: image.$image
            });

            if ((sumImagesWidthImage >= imageContainerWidth - sumImagesWidthStatic && checkSumImagesWidthImage(split, minImageHeight, imageContainerWidth - sumImagesWidthStatic) && split.length >= 2) || iterator === imagesCount - 1) {
                var sumWidthGrid = 0;

                split.map(function (image) {
                    if (minImageHeight <= image.sizes.heightImage) {
                        var widthGrid = image.sizes.widthImage/(image.sizes.heightImage/minImageHeight);

                        image.sizes.widthGrid = widthGrid;
                        sumWidthGrid += widthGrid;
                    }
                });

                if (sumWidthGrid > imageContainerWidth - sumImagesWidthStatic) {
                    split.map(function (image) {
                        var heightGrid = minImageHeight/(sumWidthGrid/(imageContainerWidth - sumImagesWidthStatic));
                        image.sizes.widthGrid = image.sizes.widthGrid/(minImageHeight/heightGrid);
                    });
                }

                result.push(split);

                sumImagesWidthImage = 0;
                sumImagesWidthStatic = 0;
                minImageHeight = 9999;
                split = [];
            }
        });

        return result;
    }

    function setWidthImage(splitImages) {
        splitImages.map(function (images) {
            images.map(function (image) {
                image.$image.width(image.sizes.widthGrid);
            });
        });
    }

    var imageContainerWidth = $self.width();
    var images = getImages($self.children());
    var splitImages = getSplitImages(imageContainerWidth, images);
    setWidthImage(splitImages);
};