$('.view-password').each((element) => {
    const button = $('<i class="fa fa-eye-slash cursor-pointer" aria-hidden="true"></i>');

    element.append(button);

    button.on('click', function () {
        if (element.attr('type') === 'password') {
            element.attr('type', 'text');
        }

        if (element.attr('type') === 'text') {
            element.attr('type', 'password');
        }
    });
});
