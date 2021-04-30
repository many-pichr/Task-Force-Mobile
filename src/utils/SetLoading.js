import {setLoading} from '../redux/actions/loading';
import {connect} from 'react-redux';

const App = state => {

        console.log(true)

}
const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
