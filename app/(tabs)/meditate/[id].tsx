import { View, Text, ImageBackground, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MEDITATION_IMAGES from '@/constants/meditation-images'
import AppGradient from '@/components/AppGradient';
import { router, useLocalSearchParams } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from '@/components/CustomButton';
import {Audio} from 'expo-av';
import { MEDITATION_DATA , AUDIO_FILES} from '@/constants/MeditationData';
import { TimerContext } from '@/context/TimerContext';

const Meditate = () => {
  const {id} = useLocalSearchParams();

  const {duration: secondsRemaining, setDuration} = useContext(TimerContext);
  // const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isMeditating, setIsMeditating] = useState(false);
  const [audioSound, setAudioSound] =useState<Audio.Sound>();
  const [isPlayingAudio, setPlayingAudio] = useState(false);

  useEffect(()=>{
    let timerId: NodeJS.Timeout;

    //exit
    if(secondsRemaining ===0){
      if (isPlayingAudio) audioSound?.pauseAsync();
      setIsMeditating(false);
      return;
    }

    if(isMeditating){
      timerId = setTimeout(()=>{
        setDuration(secondsRemaining-1);
      },1000);
    }

    return ()=>{
      clearTimeout(timerId);
    }

  },[secondsRemaining, isMeditating]);

  //for back button
  useEffect(()=>{
      return () => {
        setDuration( 5 * 60);
        audioSound?.unloadAsync();
    };
  }, [audioSound]);

  const toggleMeditationSessionStatus = async ()=>{
    if(secondsRemaining===0) setDuration(5* 60);
    setIsMeditating(!isMeditating);

    await toggleSound();
  }

  const toggleSound = async()=>{
    const sound = audioSound? audioSound :  await intializeSound();
    const status = await sound?.getStatusAsync();

    if(status?.isLoaded && !isPlayingAudio){
      await sound.playAsync();
      setPlayingAudio(true);
    }else{
      await sound.pauseAsync();
      setPlayingAudio(false);
    }
  }

  const intializeSound = async ()=>{
    const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;
    const {sound} = await Audio.Sound.createAsync(AUDIO_FILES[audioFileName]);
    setAudioSound(sound);
    return sound;
  }
  const handleAdjustDuration = () =>{
    if(isMeditating) toggleMeditationSessionStatus(); //to stop it

    router.push("/(modal)/adjust-meditation-duration");
  }

  // Format the timeLeft to ensure two digits are displayed
  const formattedTimeMinutes = String(
        Math.floor(secondsRemaining / 60)
    ).padStart(2, "0");
  const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, "0");

  const handleGoBack = ()=>{
    setAudioSound(undefined);//my fix for the audio sound coudn't be stopped just back router back
    setPlayingAudio(false);
    setIsMeditating(false);
    router.back();
  }

  return (
    <View className='flex-1'>
        <ImageBackground 
            source={MEDITATION_IMAGES[Number(id)-1]} 
            resizeMode='cover' className='flex-1'>
            <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}>
                <Pressable onPress={handleGoBack} className='absolute top-16 left-6 z-10'>
                    <AntDesign name="leftcircleo" size={50} color="white" />
                </Pressable>
                <View className='flex-1 justify-center'>
                    <View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center">
                        <Text className="text-4xl text-blue-800 font-rmono">{formattedTimeMinutes}:{formattedTimeSeconds}</Text>
                    </View>
                </View>
                <View className='mb-5'>
                  <CustomButton title="Adjust duration" onPress={handleAdjustDuration}/>
                  <CustomButton title={isMeditating? "Pause" : "Start Meditation"} containerStyles="mt-4" onPress={toggleMeditationSessionStatus}/>
                </View>
            </AppGradient>
        </ImageBackground>
    </View>
  )
}

export default Meditate