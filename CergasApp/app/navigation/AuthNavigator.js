import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import routes from "./routes"
import Login from "../screens/Login"
import Register from "../screens/Register"
import Welcome from "../screens/Welcome"

const Stack = createStackNavigator()

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
        />
        <Stack.Screen name={routes.LOGIN} component={Login} />
        <Stack.Screen name={routes.REGISTER} component={Register} />
    </Stack.Navigator>
)

export default AuthNavigator
