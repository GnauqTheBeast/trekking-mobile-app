import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingVertical: 16,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold'
    },
    saveButton: {
        position: 'absolute',
        right: 16,
        top: 16
    },
    saveButtonText: {
        fontSize: 17,
        fontFamily: 'OpenSans-Bold',
        color: '#FF8E4F',
    },
    saveButtonTextDisabled: {
        color: '#D3D3D3',
    },
    coverPhotoContainer: {
        height: 180,
        backgroundColor: '#FF8E4F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarWrapper: {
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        zIndex: 10,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white',
        justifyContent: 'center',
        alignContent: 'center',
    },
    icon: {
        color: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        zIndex: 10,
        backgroundColor: '#f2f2f2'
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: 4,
        paddingBottom: 8,
        paddingHorizontal: 32,
        zIndex: 20
    },
    editButtonText: {
        color: 'white',
        fontFamily: 'OpenSans-Bold',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    fieldContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 30,
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: 'white',
    },
    fieldLabel: {
        fontFamily: 'OpenSans-Regular',
    },
    fieldValue: {
        fontFamily: 'OpenSans-Regular',
        marginRight: 10
    },
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingLeft: 16,
        backgroundColor: 'white',
    },
    addressLabel: {
        fontFamily: 'OpenSans-Regular',
    },
    addressValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '66%',
        marginRight: 0
    },
    addressValue: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        textAlign: 'right',
        flexWrap: 'wrap',
    },
    placeholderValue: {
        color: '#8E8E93',
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginLeft: 16,
    },
    modal: {
        justifyContent: 'center',
        margin: 30,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
    },
    picker: {
        width: 200,
        height: 80,
    },
    selectedItem: {
        backgroundColor: '#E1F2DC',
        fontFamily: 'OpenSans-Regular'
    },
    pickItem: {
        fontFamily: 'OpenSans-Regular'
    },
    modalButton: {
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
        modalButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
  });

export default styles;