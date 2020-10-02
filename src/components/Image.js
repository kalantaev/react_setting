import React from 'react';
import {API_ROOT} from "../agent";
export const image = (id, width, height) => <img src={`${API_ROOT}/image/${id}`} width={width} height={height}/>