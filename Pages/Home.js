import React, {useState, useEffect} from 'react'
import { View, Text, Button } from 'react-native'
import { authorize } from 'react-native-app-auth';
import {CLIENT_ID, HOST_URI, GENERATED_HASH} from '@env';

const Home = () => {

    const [tokensGenerated, setTokensGenerated] = useState(false);
    const [accessToken, setAccessToken] = useState("")
   
     const config = {
           issuer: `https://login.microsoftonline.com/${HOST_URI}`,  
           clientId: CLIENT_ID,
           redirectUrl: `msauth://com.nativeauth/${GENERATED_HASH}`, 
           scopes: ['openid', 'profile', 'email', 'offline_access'],  
               
            }; 
               
        async function signIn() {
                   try { 
                        const result = await authorize(config);   
                        //   console.log('Authorization Result:', result);  
                        console.log(result.accessToken); 
                        setAccessToken(result.accessToken)
                        setTokensGenerated(true)
                    }
                    catch (error) {
                        console.error('Authorization Error:', error);
                   }
                
        }

        const fetchDetails = async (accessToken) => {
            try{
                await fetch('https://graph.microsoft.com/v1.0', {
                    method: 'GET', 
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((res) => {
                     console.log(res)
                })
            }
            catch(error){
                console.log("error :" + error)
            }
        }

        useEffect(() => {
            if(tokensGenerated){
                fetchDetails(accessToken); 
            }
            
            return(() => {
                setTokensGenerated(false)
            })
        }, [tokensGenerated])


    return(
        <View>
        <Button
         title = "Login"
         onPress = {signIn}
        ></Button>
            
        </View>
    )
}

export default Home; 