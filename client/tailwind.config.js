/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                eco: {
                    50: '#E8F5E9',
                    100: '#C8E6C9',
                    200: '#A5D6A7',
                    300: '#81C784',
                    400: '#66BB6A',
                    500: '#4CAF50',
                    600: '#43A047',
                    700: '#388E3C',
                    800: '#2E7D32',
                    900: '#1B5E20',
                },
                concrete: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#EEEEEE',
                    300: '#E0E0E0',
                    400: '#BDBDBD',
                    500: '#9E9E9E',
                    600: '#757575',
                    700: '#616161',
                    800: '#424242',
                    900: '#212121',
                },
                sand: {
                    50: '#FFFDE7',
                    100: '#FFF9C4',
                    200: '#FFF59D',
                    300: '#FFF176',
                    400: '#FFEE58',
                    500: '#F5F5DC',
                    DEFAULT: '#F5F5DC',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            backgroundImage: {
                'eco-gradient': 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)',
                'dark-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            },
        },
    },
    plugins: [],
};
