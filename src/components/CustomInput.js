// Custom Input Component
import React, { forwardRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Custom Input Component
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Text change handler
 * @param {boolean} props.secureTextEntry - Whether input is secure
 * @param {string} props.keyboardType - Keyboard type
 * @param {string} props.autoCapitalize - Auto capitalize setting
 * @param {boolean} props.autoCorrect - Auto correct setting
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {Object} props.style - Additional container styles
 * @param {Object} props.inputStyle - Additional input styles
 * @param {string} props.helperText - Helper text below input
 * @returns {JSX.Element}
 */
const CustomInput = forwardRef(({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  error,
  required = false,
  disabled = false,
  style,
  inputStyle,
  helperText,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = Boolean(error);
  const showPasswordToggle = secureTextEntry;

  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    if (hasError) baseStyle.push(styles.containerError);
    if (isFocused) baseStyle.push(styles.containerFocused);
    if (disabled) baseStyle.push(styles.containerDisabled);
    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    if (hasError) baseStyle.push(styles.inputError);
    if (disabled) baseStyle.push(styles.inputDisabled);
    return baseStyle;
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={getContainerStyle()}>
        <TextInput
          ref={ref}
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
            disabled={disabled}
          >
            <Text style={[
              styles.passwordToggleText,
              disabled && styles.passwordToggleTextDisabled
            ]}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <View style={styles.messageContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  
  labelContainer: {
    marginBottom: 8,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  
  required: {
    color: '#FF3B30',
  },
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  
  containerFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  containerError: {
    borderColor: '#FF3B30',
  },
  
  containerDisabled: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E5EA',
  },
  
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D1D1F',
  },
  
  inputError: {
    color: '#1D1D1F',
  },
  
  inputDisabled: {
    color: '#8E8E93',
  },
  
  passwordToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  passwordToggleText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  
  passwordToggleTextDisabled: {
    color: '#8E8E93',
  },
  
  messageContainer: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  
  helperText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

CustomInput.displayName = 'CustomInput';

export default CustomInput; 