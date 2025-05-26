import { StyleSheet } from 'react-native';

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
  body: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontFamily: 'OpenSans-Medium',
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 14,
  },
  itemLabel: {
    fontFamily: 'OpenSans-Regular',
  },
  itemValue: {
    fontFamily: 'OpenSans-Regular',
    marginRight: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemNote: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#999999',
    marginTop: 4,
    maxWidth: '90%',
  },
  switchBtn: {
    position: 'absolute',
    right: 8
  },
  rightIcon: {
    color: '#999'
  }
});

export default styles;