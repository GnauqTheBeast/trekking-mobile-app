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
  content: {
    flex: 1,
    // alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F2',
  },
  trekList: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  trekListContent: {
    paddingTop: 8,
    paddingBottom: 75,
  },
  noContainer: {
    alignItems: 'center',
    marginTop: 80
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    marginBottom: 32,
    width: '100%',
    textAlign: 'center'
  },
  buttonText: {
    backgroundColor: '#2A5848',
    color: 'white',
    fontFamily: 'OpenSans-Bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  }
});

export default styles;