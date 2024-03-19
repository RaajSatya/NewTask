import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';
import AxiosApi from '../api/AxiosApi';

export default function Home() {
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchData = useCallback(async (offset) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('user_id', '108');
            formData.append('offset', offset);
            formData.append('type', 'popular');

            const response = await AxiosApi.post('getdata.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImages((prevImages) => [...prevImages, ...response.data.images]); // Append new images to the existing list
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(page.toString());
    }, [fetchData, page]); // Fetch data when page changes

    const loadMoreImages = () => {
        setPage(page + 1); // Increment page to load more images
    };

    const renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Details', { data: item })}>
            <Image source={{ uri: item?.xt_image }} style={{ aspectRatio: 1 }} />
        </TouchableWithoutFeedback>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
                {loading ? (
                    <ActivityIndicator size={'large'} />
                ) : images.length === 0 ? (
                    <Text>No data found</Text>
                ) : (
                    <FlatList
                        data={images}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index}
                    // onEndReached={loadMoreImages} // Load more images when reaching the end of the list
                    // onEndReachedThreshold={0.5} // Load more when the user is at the 50% mark of the list
                    />
                )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                <Text>{`Items: ${images.length}`}</Text>
                <Button onPress={loadMoreImages} mode='text'>Load More</Button>
            </View>
        </View>
    );
}
