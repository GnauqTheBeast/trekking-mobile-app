import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 14,
        marginTop: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
    },
    summaryCard: {
        backgroundColor: '#E1F2DC',
        margin: 16,
        borderRadius: 10,
        borderColor: '#E2E2E2',
        padding: 12,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowRadius: 10,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    summaryContent: {
        flexDirection: 'row',
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
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8
    },
    hostText: {
        fontSize: 12,
        fontFamily: 'OpenSans-SemiBold'
    },
    trekImage: {
        width: 100,
        height: 115,
        borderRadius: 8,
    },
    trekInfo: {
        flex: 1,
        marginLeft: 10
    },
    trekName: {
        fontSize: 16,
        fontFamily: 'OpenSans-Bold',
        color: '#2A5848',
    },
    trekDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 3
    },
    trekDetailText: {
        fontSize: 11,
        fontFamily: 'OpenSans-SemiBold',
        color: '#262626',
    },
    batchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 2,
        marginRight: 8
    },
    dateContainer: {
        alignItems: 'flex-start',
    },
    dateLabel: {
        fontSize: 9,
        fontFamily: 'OpenSans-Regular'
    },
    dateLine: {
        height: 2,
        width: 26,
        backgroundColor: '#FF8E4F',
    },
    dateValuesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    dateValue: {
        fontSize: 11,
        fontFamily: 'OpenSans-SemiBold'
    },
    personsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 5
    },
    personsText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 12,
    },
    totalValue: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
        color: '#FF8E4F',
    },
    infoCard: {
        margin: 16,
        marginTop: 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'OpenSans-ExtraBold',
        marginBottom: 12,
        color: '#2A5848'
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'OpenSans-Regular',
        color: 'rgba(0, 0, 0, 0.5)',
    },
    infoValue: {
        flex: 2,
        textAlign: 'right',
        fontSize: 13,
        fontFamily: 'OpenSans-Regular',
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    paymentLabel: {
      fontSize: 14,
      color: '#757575',
    },
    paymentValue: {
      fontSize: 14,
      color: '#212121',
      textAlign: 'right',
    },
    discountValue: {
      color: '#F97316',
    },
    cancelButton: {
      margin: 16,
      marginTop: 0,
      padding: 12,
      borderWidth: 1,
      borderColor: '#F97316',
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 24,
    },
    cancelButtonText: {
      color: '#F97316',
      fontSize: 16,
      fontWeight: '500',
    },
});

export default styles;