import React, {Component} from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
} from 'react-native';
import App from './App';
import Headline from './Headline';
import QuizService from './QuizService';
import {DrawerContentScrollView} from '@react-navigation/drawer';

class CustomDrawerContent extends Component {
    constructor() {
        super();
        this.state = {
            testsData: [],
        };

    }

    async componentDidMount() {
        const quiz=new QuizService();
        this.setState({
            testsData: await quiz.getTests(),
        })
    }

    getResults=async (navigation) => {
        const quiz = new QuizService();

        navigation.navigate('Result', {
            result: await quiz.getResult(),
        });
    }

    async handleOnPress(navigation,item){
        const quiz=new QuizService();
        const myDetails= await quiz.getDetailsTests(item.id);
        navigation.navigate('Test', {
            id: item.id,
            title: item.name,
            description:item.description,
            tags:item.tags,
            level:item.level,
            numberOfTasks: item.numberOfTasks,
            currentQuestion: 0,
            score:0,
            tasks: myDetails.tasks,
            end: false,

        });
        console.log(myDetails.tasks[0].question);
    }

    render() {
        const {navigation} = this.props;
        return(
        <DrawerContentScrollView style={{backgroundColor: 'lightgrey'}}>
            <Text style={styles.Oswald}>Quiz App</Text>
            <Image
                source={require('./logo.png')}
                style={{height: 150, width: 140, alignSelf: 'center'}}
            />
            <View
                style={{paddingBottom: 10, borderColor: 'black', borderBottomWidth: 1}}>
                <TouchableOpacity
                    style={styles.drawerButtons}
                    onPress={() => {
                        navigation.navigate('Home');
                    }}>
                    <Text style={styles.OpenSans}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerButtons}
                    onPress={() => {
                        this.getResults(navigation);
                    }}>
                    <Text style={styles.OpenSans}>Result</Text>
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    //keyExtractor={(item) => item.id}
                    data={this.state.testsData}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.drawerButtons}
                            onPress={() => {
                                this.handleOnPress(navigation,item);
                            }}>
                            <Text style={styles.OpenSans} >{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </DrawerContentScrollView>

        );
    }

}

const styles = StyleSheet.create({
    drawerButtons: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        margin: 12,
        height: 55,
        fontWeight: 'bold',
    },
    Oswald: {
        fontSize: 30,
        alignSelf: 'center',
        margin: 10,
        fontFamily: 'Oswald-VariableFont_wght',
    },
    OpenSans: {
        fontSize: 15,
        alignSelf: 'center',
        margin: 10,
        fontFamily: 'OpenSans-Regular',
    },
});


export default CustomDrawerContent;
