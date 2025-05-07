import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  trekItem: {
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 4
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 10
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  wrapHostAvatar: {
    backgroundColor: '#2A5848',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderRadius: 50,
  },
  hostAvt: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover'
  },
  hostName: {
    fontFamily: 'OpenSans-Medium',
  },
  statusLabel: {
    color: '#E40505',
    fontFamily: 'OpenSans-Bold',
  },
  trekInfoContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  trekImage: {
    width: 90,
    height: 100,
    borderRadius: 8,
  },
  trekDetails: {
    flex: 1,
    marginLeft: 10,
  },
  trekName: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#2A5848',
  },
  trekDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3
  },
  trekDetailText: {
    fontSize: 11,
    fontFamily: 'OpenSans-Medium',
    color: '#262626',
  },
  trekPrice: {
    color: '#FF8E4F',
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    position: 'absolute',
    bottom: -5,
    right: 0,
  },
  trekPaymentContainer: {
  },
  trekPaymentText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    alignSelf: 'flex-end',
    marginBottom: 12
  },
  trekPaymentAmount: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 15,
    color: '#2A5848'
  },
  trekActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(42, 88, 72, 0.5)',
    borderRadius: 5,
    marginRight: 8,
  },
  detailText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: '#2A5848',
  },
  bookAgainButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 142, 79, 0.5)',
  },
  bookAgainText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: '#FF8E4F',
  },
});

export default styles;