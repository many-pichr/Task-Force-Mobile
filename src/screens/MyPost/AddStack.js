import React from 'react';
import { Text, View } from 'react-native';

class AddStack extends React.Component{
    constructor(props) {
        super(props);
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            props.navigation.navigate('AddPost',{add:true})
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    render() {
        return (
            <></>
        );
    }
}

export default AddStack;
