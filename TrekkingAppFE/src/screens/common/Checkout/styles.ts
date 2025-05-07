import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    header: {
      marginTop: 45,
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
    summaryCard: {
      backgroundColor: '#E1F2DC',
      margin: 16,
      borderRadius: 10,
      padding: 10,
      overflow: 'hidden',
    },
    summaryTop: {
      flexDirection: 'row',
    },
    trekImage: {
      width: 90,
      height: 105,
      borderRadius: 8,
    },
    trekInfo: {
      flex: 1,
      marginLeft: 10,
    },
    trekName: {
      fontSize: 16,
      fontFamily: 'OpenSans-Bold',
      color: '#2A5848',
      marginBottom: 4,
      marginLeft: 3
    },
    wrapHostAvatar: {
      backgroundColor: '#2A5848',
      justifyContent: 'center',
      alignItems: 'center',
      width: 20,
      height: 20,
      borderRadius: 50,
      overflow: 'hidden',
      marginLeft: 3
    },
    hostAvt: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    hostRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 8
    },
    hostText: {
      fontSize: 12,
      fontFamily: 'OpenSans-SemiBold'
    },
    batchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
      marginLeft: 3
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
      width: 20,
      backgroundColor: '#FF7F50',
    },
    dateValuesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5
    },
    dateValue: {
      fontSize: 11,
      fontFamily: 'OpenSans-SemiBold'
    },
    personsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3
    },
    personsText: {
      fontFamily: 'OpenSans-SemiBold',
      fontSize: 12,
    },
    divider: {
      height: 1,
      backgroundColor: '#ddd',
      marginVertical: 8,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    totalValue: {
      fontSize: 18,
      fontFamily: 'OpenSans-Bold',
      color: '#FF8E4F',
    },
    flex: {
      flex: 1,
    },
    discountAmount: {
      fontSize: 14,
      fontFamily: 'OpenSans-Bold',
      color: '#FF8E4F',
      marginRight: 4,
    },
    orangeTag: {
      backgroundColor: '#FF8E4F',
      alignSelf: 'flex-start',
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    orangeTagText: {
      fontSize: 12,
      color: '#FF8E4F',
    },
    discountInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    discountDescription: {
      flex: 1,
      fontSize: 14,
    },
    infoButton: {
      padding: 4,
    },
    discountValidity: {
      fontSize: 12,
      color: '#999',
    },
    paymentMethodCard: {
      backgroundColor: '#fff',
      margin: 16,
      marginTop: 0,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 4,
      overflow: 'hidden',
    },
    paymentMethodHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    methodIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#FF7F50',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    methodIconText: {
      color: '#fff',
      fontFamily: 'OpenSans-Bold',
    },
    paymentMethodTitle: {
      fontSize: 16,
      fontFamily: 'OpenSans-ExtraBold',
      color: '#2A5848'
    },
    methodOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    radioContainer: {
      marginRight: 12,
    },
    radioOuter: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: '#999',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FF7F50',
    },
    methodName: {
      fontFamily: 'OpenSans-Regular',
      fontSize: 14,
    },
    paymentDetailCard: {
      backgroundColor: '#fff',
      margin: 16,
      marginTop: 0,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 10,
      overflow: 'hidden',
      marginBottom: 100,
    },
    paymentDetailTitle: {
      fontSize: 16,
      fontFamily: 'OpenSans-ExtraBold',
      color: '#2A5848',
      marginBottom: 4,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    detailLabelAmount: {
      fontFamily: 'OpenSans-Regular',
      color: 'rgba(0, 0, 0, 0.5)',
    },
    detailValueAmount: {
      fontFamily: 'OpenSans-Regular',
      color: 'rgba(0, 0, 0, 0.5)',
    },
    detailLabelPayment: {
      fontFamily: 'OpenSans-Regular',
    },
    detailValuePayment: {
      fontFamily: 'OpenSans-Regular',
    },
    discountValue: {
      color: '#FF7F50',
    },
    detailValueBold: {
      fontSize: 14,
      fontFamily: 'OpenSans-Bold',
    },
    termsText: {
      fontSize: 12,
      fontFamily: 'OpenSans-Regular',
      marginTop: 12,
      lineHeight: 18,
    },
    termsLink: {
      color: '#005EFF',
    },
    priceConfirmPaymentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 10,
      zIndex: 1000
    },
    totalPriceValue: {
      color: '#2A5848',
      fontFamily: 'OpenSans-Bold',
      fontSize: 20,
    },
    confirmButtonText: {
      backgroundColor: '#FF8E4F',
      color: 'white',
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 5
    },
});

export default styles;