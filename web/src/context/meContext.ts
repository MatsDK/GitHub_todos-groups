import React from "react";
import { MeMe } from "../../generated/apolloComponents";

export const MeContext = React.createContext<null | MeMe>(null);
