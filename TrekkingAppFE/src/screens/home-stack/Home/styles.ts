import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    header: {
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E1F2DC',
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 5,
        height: 30,
        justifyContent: 'center',
    },
    searchInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        paddingVertical: 0,
    },

    welcomeText: {
        color: 'black',
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 18
    },
    currentLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentLocationIcon: {
        color: '#1F9935',
    },
    currentLocationText: {
        color: '#1F9935',
        fontFamily: 'OpenSans-Bold',
    },
    moneyContainer: {
        backgroundColor: '#FF8E4F',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5
    },
    moneyText: {
        color: 'white',
        fontFamily: 'OpenSans-Bold',
    },
    listContainer: {
        paddingHorizontal: 20,
        padding: 10,
    },
    headerList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 3
    },
    titleList: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 18
    },
    allDirection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    allDirectionText: {
        fontFamily: 'OpenSans-SemiBold',
        color: '#1F9935'
    },
    allDirectionIcon: {
        color: '#1F9935'
    },
    contentList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 5,
    },
    btnSeeAll: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 3
    },
    btnSeeAllIcon: {
        color: '#1F9935'
    },
    contentListTrek: {
        width: '100%',
        gap: 5
    }
})

export default styles;