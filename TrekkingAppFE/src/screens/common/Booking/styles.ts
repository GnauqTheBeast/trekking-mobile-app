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
  trekCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  trekHeader: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    overflow: 'hidden',
  },
  hostAvt: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover'
  },
  businessName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
  },
  trekContent: {
    flexDirection: 'row',
    padding: 10,
  },
  trekImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  trekInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trekName: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#2A5848',
    marginBottom: 4,
  },
  commonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  commonText: {
    fontSize: 13,
    fontFamily: 'OpenSans-SemiBold'
  },
  pricePerPerson: {
    position: 'absolute',
    right: 5,
    bottom: 0,
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#FF8E4F'
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-ExtraBold',
    color: '#2A5848',
    marginBottom: 10,
  },
  batchesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  infoBatch: {
    backgroundColor: 'rgba(142, 142, 142, 0.2)',
    color: 'rgb(142, 142, 142)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 8,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13
  },
  selectedBatch: {
      color: '#FF5341',
      backgroundColor: 'rgba(255, 83, 65, 0.3)',
  },
  availableSlots: {
    fontFamily: 'OpenSans-SemiBold',
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantsLabel: {
    fontFamily: 'OpenSans-SemiBold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#2A5848',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  counterValue: {
    fontFamily: 'OpenSans-Bold',
    marginHorizontal: 12,
  },
  input: {
    backgroundColor: '#E1F2DC',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'OpenSans-Regular',
    marginBottom: 10
  },

  priceCheckoutContainer: {
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
  checkoutButtonText: {
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