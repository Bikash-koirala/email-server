
//   let inputView = (
//     <Form.Group className={`form-group ${error && "error"}`}>
//       <Form.Label>{labelText}</Form.Label>
//       <Form.Control
//         id={id}
//         name={name}
//         type={InputTypes.text}
//         value={value}
//         placeholder={placeholder}
//         className="input"
//         onChange={props.onChange}
//         required={required ? true : false}
//         disabled={disabled}
//         onBlur={props.onBlur}
//         defaultValue={props.initialValue}
//       />
//       {error && (
//         <Form.Text className="d-block color-secondary-1 fw-medium mt-1 pt-2">
//           {error}
//         </Form.Text>
//       )}
//     </Form.Group>
//   );

//   if (type && type === InputTypes.password) {
//     inputView = (
//       <Form.Group className="form-group">
//         <Form.Label>{labelText}</Form.Label>
//         <Form.Control
//           id={id}
//           name={name}
//           type={InputTypes.password}
//           placeholder={placeholder}
//           value={value}
//           className="input"
//           onChange={props.onChange}
//           required={required ? true : false}
//           disabled={disabled}
//           onBlur={props.onBlur}
//           defaultValue={props.initialValue}
//         />
//         {error && (
//           <Form.Text className="d-block color-secondary-1 fw-medium mt-1 pt-2">
//             {error}
//           </Form.Text>
//         )}
//       </Form.Group>
//     );
//   }

//   return inputView;
// };

// export default Input;
