import { View, Text, Pressable, Image, FlatList, ScrollView } from 'react-native'
import React from 'react';
import { GalleryPreviewData } from '@/constants/models/AffirmationCategory';
import { Href, Link } from "expo-router";

interface GuidedAffirmationsGalleryProps {
    title: string;
    previews: GalleryPreviewData[];
}

const GuidedAffirmationsGallery = ({title, previews}: GuidedAffirmationsGalleryProps) => {
  return (
    <View  className='my-5'>
      <View className="mb-2">
        <Text className="text-white font-bold text-xl">{title}</Text>
      </View>
      <View className='space-y-2'>
        <FlatList horizontal data={previews}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item)=>item.id.toString()}
            renderItem={({item})=>(
                <Link href={`/affirmations/${item.id}` as Href<string>} asChild>
                    <Pressable>
                        <View className="h-36 w-32 rounded-md mr-4">
                            <Image
                                source={item.image}
                                resizeMode="cover"
                                className="w-full h-full"
                            />
                            <Text>ProductGallery</Text>
                        </View>
                    </Pressable>
                </Link>
            )}
        />
      </View>
    </View>
  )
}

export default GuidedAffirmationsGallery