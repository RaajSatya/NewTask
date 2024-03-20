import React, { useEffect, useState } from "react";
import { Image, TouchableWithoutFeedback, View } from "react-native";

const RenderImagesItem = ({ item, navigation }) => {
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    useEffect(() => {
        const getImageSize = async () => {
            Image.getSize(item?.xt_image, (imgWidth, imgHeight) => {
                setWidth(imgWidth);
                setHeight(imgHeight);
            });
        };

        getImageSize();
    }, [item]);

    if (!width || !height) {
        return null;
    }

    const aspectRatio = width / height;
    // console.log('Ratio', width, height)
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Details', { data: item })}>
            <View style={{ flex: 1, aspectRatio }}>
                <Image source={{ uri: item?.xt_image }} style={{ flex: 1 }} resizeMode="contain" />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default RenderImagesItem