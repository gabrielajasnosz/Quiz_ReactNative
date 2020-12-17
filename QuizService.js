import React, {Component} from 'react';


class QuizService extends Component {

    baseURL = 'http://tgryl.pl/quiz';
    getResult = async () => {
        return await fetch(this.baseURL + '/results')
            .then((response) => {return response.json();})
            .then((json) => {return json;})
            .catch((error) => {console.log('Api call error' + error);});
            }


    postResult = async (nick, score, total, type) => {
        return await fetch(this.baseURL + '/result', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nick,
                score,
                total,
                type
            })
        })
            .catch((error) =>{
                console.log('POST error: ' + error)
            })
    }

    getTests = async () => {
        return await fetch(this.baseURL + '/tests')
            .then((response) => {return response.json()})
            .then((json) => {return json})
            .catch((error) => {
                console.log('Api call error' + error);
            })
    }

    getDetailsTests = async (id) => {
        return await fetch(this.baseURL + '/test/' + id)
            .then((response) => {return response.json()})
            .then((json) => {return json})
            .catch((error) => {
                console.log('Api call error' + error);
            })
    }



}
    export default QuizService;
