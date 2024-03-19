import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import AxiosApi from '../api/AxiosApi';

const validationSchema = yup.object().shape({
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^[0-9]+$/, 'Invalid phone number').min(10, 'Phone number must be at least 10 digits').required('Phone Number is required'),
});

export default function Details({ }) {
    const { data } = useRoute().params;
    const user_image = data?.xt_image
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (values, { resetForm }) => {
        try {
            setIsLoading(true)
            const formData = new FormData();
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('user_image', {
                uri: user_image,
                type: 'image/jpeg', // Adjust the type according to your image
                name: 'user_image.jpg', // Adjust the name of the image file
            });

            const response = await AxiosApi.post('savedata.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data?.status == "success") {
                resetForm()
                Alert.alert(response?.data?.message)
            } else {
                Alert.alert('something went wrong!!!!!!')
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false)
        }

    };

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <Formik
                initialValues={{ first_name: '', last_name: '', email: '', phone: '' }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={{ flex: 1, paddingHorizontal: 10, rowGap: 7, paddingVertical: 10 }}>
                        <View style={{ flex: 0.3, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center', display: "flex", borderWidth: 1 }}>
                            <Image source={{ uri: data?.xt_image }} style={StyleSheet.absoluteFill} />
                            <Text style={{ textAlign: 'center', fontSize: 20, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: 5 }}>Product Id : {data?.id}</Text>
                        </View>
                        <View style={{ flex: 0.7, rowGap: 7 }}>
                            <TextInput
                                label={'First Name'}
                                onChangeText={handleChange('first_name')}
                                onBlur={handleBlur('first_name')}
                                value={values.first_name}
                                keyboardType='default'
                                error={touched.first_name && errors.first_name ? true : false}
                            />
                            {touched.first_name && errors.first_name &&
                                <Text style={{ color: 'red' }}>{errors.first_name}</Text>
                            }
                            <TextInput
                                label={'Last Name'}
                                onChangeText={handleChange('last_name')}
                                onBlur={handleBlur('last_name')}
                                value={values.last_name}
                                keyboardType='default'
                                error={touched.last_name && errors.last_name ? true : false}
                            />
                            {touched.last_name && errors.last_name &&
                                <Text style={{ color: 'red' }}>{errors.last_name}</Text>
                            }
                            <TextInput
                                label={'Email'}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType='email-address'
                                error={touched.email && errors.email ? true : false}
                            />
                            {touched.email && errors.email &&
                                <Text style={{ color: 'red' }}>{errors.email}</Text>
                            }
                            <TextInput
                                label={'Phone Number'}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                keyboardType='phone-pad'
                                error={touched.phone && errors.phone ? true : false}
                            />
                            {touched.phone && errors.phone &&
                                <Text style={{ color: 'red' }}>{errors.phone}</Text>
                            }
                            <KeyboardAvoidingView
                                style={{ flex: 1 }}
                                behavior={Platform.OS === "ios" ? "padding" : "position"}
                                keyboardVerticalOffset={100}
                            >
                                <Button loading={isLoading} disabled={isLoading} mode='contained' onPress={handleSubmit}>Submit</Button>
                            </KeyboardAvoidingView>

                        </View>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
}
