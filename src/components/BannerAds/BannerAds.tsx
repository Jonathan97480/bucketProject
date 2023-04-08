
import { View } from 'react-native';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import React from 'react';


export default function BannerAds(props: { key?: string }) {
    const adUnitId = __DEV__ ? TestIds.BANNER : props.key ? props.key : 'ca-app-pub-2398424925470703/2494426460';
    return (<View
        style={{
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <BannerAd

            unitId={adUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,

            }}
        />

    </View>)
}