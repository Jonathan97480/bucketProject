const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-2398424925470703/2494426460';
import { View } from 'react-native';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import React from 'react';


export default function BannerAds() {
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