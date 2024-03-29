import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';
import AxiosApi from '../api/AxiosApi';
import RenderImagesItem from '../components/RenderImagesItem';

export default function Home() {
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isReachedAtEnd, setisReachedAtEnd] = useState(false)
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
            const newImages = response.data.images;
            setImages((prevImages) => [...prevImages, ...newImages]); // Append new images to the existing list

            if (newImages.length === 0) {
                setHasMoreData(false);
            }
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
                        renderItem={({ item }) => <RenderImagesItem item={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()} // Ensure key is a string
                        onEndReached={() => setisReachedAtEnd(true)}
                    />
                )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button mode='text'>{`Items: ${images.length}`}</Button>
                {
                    isReachedAtEnd && hasMoreData && (
                        <Button compact onPress={loadMoreImages} mode='text'>Load More</Button>

                    )
                }
            </View>


        </View>
    );
}
