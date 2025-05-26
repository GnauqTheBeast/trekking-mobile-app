import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#f2f2f2'
    },
    header: {
        marginTop: 0,
        paddingTop: 5,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'OpenSans-Bold'
    },
    loaderContainer: {
        paddingVertical: 20,
        alignItems: 'center'
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center'
    },
    errorText: {
        color: '#FF4F4F',
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        textAlign: 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'OpenSans-Regular',
        color: '#666666',
        textAlign: 'center'
    },
    listContainer: {
        paddingTop: 8,
    }
});

export default styles;