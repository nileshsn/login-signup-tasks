export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validatePassword = (password) => {
    return password && password.length >= 1;
};

export const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    let initials = '';
    for(let i=0; i<Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();
};
