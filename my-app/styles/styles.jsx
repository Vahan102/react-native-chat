import { StyleSheet } from 'react-native';

export const gStyle = StyleSheet.create({
    main:{
        color:"red"
    }
})

export const styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: '#36393f', 
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center', 
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  primaryHeader: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  secondaryHeader: {
    color: '#b9bbbe',
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#b9bbbe',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#202225', 
    color: '#dcddde',         
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent', 
  },
  linkContainer: {
    marginBottom: 20,
  },
  linkText: {
    color: '#00aff4', 
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#5865F2',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})