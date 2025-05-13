
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    body: {
        flex: 1,
        backgroundColor: 'red'
    },
    imageItem: {
        width: width,
        height: height / 2,
        resizeMode: "cover",
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: height / 2 + 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 10,
        paddingVertical: 16,
        paddingHorizontal: 20
    },
    dotContainer: {
        position: "absolute",
        top: height / 2 - 65,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "white",
        marginHorizontal: 4,
    },
    activeDot: {
        width: 30,
        backgroundColor: "white",
        borderRadius: 3,
    },
    nameTrek: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: '#2A5848'
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    locationText: {
        fontFamily: 'OpenSans-SemiBold'
    },
    commonTourInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    infoTitle: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 10,
        color: '#8E8E8E'
    },
    infoData: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 10
    },
    split: {
        height: '60%',
        width: 1,
        backgroundColor: '#8E8E8E'
    },
    infoDataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    descriptionContainer: {
        marginTop: 15
    },
    descriptionText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 12
    },
    readMoreText: {
        color: '#2A5848',
        fontFamily: 'OpenSans-ExtraBold',
        fontSize: 12
    },
    hostContainer: {
        backgroundColor: '#E1F2DC',
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    hostNameContainer: {
        flexDirection: 'row',
        gap: 10
    },
    wrapHostAvatar: {
        backgroundColor: '#2A5848',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 50,
        overflow: 'hidden',
    },
    hostAvt: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    visitText: {
        borderWidth: 1,
        borderColor: '#FF8E4F',
        borderRadius: 5,
        fontFamily: 'OpenSans-Bold',
        fontSize: 11,
        paddingHorizontal: 8,
        paddingVertical: 1,
        color: '#FF8E4F'
    },
    commonTrekInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 5
    },
    availableContainer: {
        marginTop: 10
    },
    batchContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    infoBatch: {
        backgroundColor: 'rgba(142, 142, 142, 0.2)',
        // color: '#8E8E8E',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 5,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 13
    },
    selectedBatch: {
        color: '#FF5341',
        backgroundColor: 'rgba(255, 83, 65, 0.3)',
    },
    bookContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 25,
        paddingTop: 10,
        zIndex: 1000
    },
    priceText: {
        color: '#2A5848',
        fontFamily: 'OpenSans-Bold',
        fontSize: 17,

    },
    btnBook: {
        backgroundColor: '#FF8E4F',
        color: 'white',
        fontFamily: 'OpenSans-ExtraBold',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5
    }

})

export default styles;