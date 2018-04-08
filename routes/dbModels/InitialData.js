import Info from './Info';

const initialData = function () {
  Info.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const infos = new Info({ infoFi: '<p><span style="font-size: 13pt;">N&auml;it&auml; ohjeita voidaan muokata /management sivun kautta.' +
        '</span></p><p><span style="font-size: 13pt;">T&auml;ll&auml; lomakkeella voit hakea mukaan kilpailuun!</span></p><p>' +
        '<span style="font-size: 13pt;">Kaikki lomakkeen kent&auml;t ovat pakollisia lukuunottamatta liitetiedostoa. Voit halutessasi ' +
        'liitt&auml;&auml; hakemukseesi yhden .pdf liitetiedoston, jonka koko voi olla enint&auml;&auml;n 10 megabitti&auml;.</span></p>' +
        '<p><span style="font-size: 13pt;">Antamaasi s&auml;hk&ouml;postiosoitetta k&auml;ytet&auml;&auml;n ainoastaan lis&auml;ohjeiden ' +
        'l&auml;hett&auml;miseen ja kilpailun etenemisest&auml; tiedottamiseen. Tietojasi ei k&auml;ytet&auml; muuhun kuin kilpailun ' +
        'j&auml;rjest&auml;miseen.</span></p>',
      infoEn: '<p><span style="font-size: 13pt;">These instructions can be changed from the /management page.<br /></span></p><p>' +
      '<span style="font-size: 13pt;">With this form you can apply to the competition!</span></p><p><span style="font-size: 13pt;">All ' +
      'of the fields are required except for the .pdf attachement. You may attach one .pdf file to your application, which can be up to ' +
      '10 megabytes.</span></p><p><span style="font-size: 13pt;">Your email address will be used for further instructions. Your details ' +
      'will not be used for anything else, except the competition.</span></p>', emailInfoFi: 'Kiitos osallistumisestasi! Olemme ' +
        'tarkistaneet hakemuksesi ja pohdimme sen etenemistä kilpailussa.',
      emailInfoEn: 'Thank you for participating! We have viewed your application and we will report to you about your potential ' +
      'competition success.',
      termsFi: '<p><strong>K&auml;ytt&ouml;ehdot lis&auml;t&auml;&auml;n my&ouml;hemmin admin-k&auml;ytt&auml;j&auml;tilin kautta ' +
      '/management sivulta.</strong></p>',
      termsEn: '<p><strong>The terms and conditions will be added later by admin via the /management page.</strong></p>',
      cuid: 'cikqgkv4q01ck7453ualdn3hd' });

    Info.create([infos], (error) => {
      if (!error) {
        // console.log('ready to go....');
      }
    });
  });
};

module.exports = initialData;
