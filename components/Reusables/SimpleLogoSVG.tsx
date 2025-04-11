import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

interface SimpleLogoSvgProps extends SvgProps {
    width: number;
    height: number;
    }
const SimpleLogoSvg = ({ width, height, ...props }: SimpleLogoSvgProps) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <Path
      fill="#008229"
      d="M23.76 0H3.24C1.45 0 0 1.343 0 3s1.45 3 3.24 3h20.52C25.55 6 27 4.657 27 3s-1.45-3-3.24-3ZM23.76 27H3.24C1.45 27 0 28.343 0 30s1.45 3 3.24 3h20.52c1.79 0 3.24-1.343 3.24-3s-1.45-3-3.24-3ZM2 25 13.997 9.996C15.01 8.732 16.51 8 18.09 8H25L13.537 22.92c-1.01 1.314-2.54 2.08-4.159 2.08H2Z"
    />
  </Svg>
)
export default SimpleLogoSvg;
