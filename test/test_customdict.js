const wordcut = require("../lib/wordcut");

describe("Wordcut with custom dictionary", function() {
  it("should recognize custom dict as glob", function() {
    wordcut.init(`${__dirname}/custom*.txt`, true);
    const segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
    expect(segmentedResult).toStrictEqual(["ฉัน", "ชอบ", "กินข้าว", "อร่อยมากมาก"]);
  });

  it("should recognize word in custom dict", function() {
    wordcut.init(`${__dirname}/customdict.txt`, true);
    const segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
    expect(segmentedResult).toStrictEqual(["ฉัน", "ชอบ", "กินข้าว", "อร่อยมากมาก"]);
  });

  it("should recognize word in custom dict and additionalWords", function() {
    wordcut.init(`${__dirname}/customdict.txt`, true, ["ข้าวอร่อยมากมาก", "ชอบกิน"]);
    const segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
    expect(segmentedResult).toStrictEqual(["ฉัน", "ชอบกิน", "ข้าวอร่อยมากมาก"]);
  });
});
