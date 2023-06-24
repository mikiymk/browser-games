use std::{fmt::Debug, marker::PhantomData};

use wasm_bindgen::JsValue;

#[derive(Debug)]
pub struct JsFunction<'a, T> {
    js_function: &'a js_sys::Function,
    call_type: PhantomData<T>,
}

impl<'a, T> JsFunction<'a, T>
where
    T: serde::ser::Serialize,
{
    pub fn new(js_function: &'a js_sys::Function) -> Self {
        JsFunction {
            js_function,
            call_type: PhantomData,
        }
    }

    pub fn call(&self, value: &T) -> Result<JsValue, String> {
        self.js_function
            .call1(
                &JsValue::NULL,
                &serde_wasm_bindgen::to_value(value).map_err(Self::js_value_to_string)?,
            )
            .map_err(Self::js_value_to_string)
    }

    fn js_value_to_string<Err>(error: Err) -> String
    where
        Err: Debug,
    {
        format!("{:?}", error)
    }
}
