package ariot18.itera.no.greatplacetoworkspace;

import android.nfc.NdefMessage;
import android.nfc.NdefRecord;


import java.util.ArrayList;
import java.util.List;

public class NdefMessageParser {
    private NdefMessageParser() {
    }

    public static List<ParsedNdefRecord> parse(NdefMessage message) {
        return getRecords(message.getRecords());
    }

    private static List<ParsedNdefRecord> getRecords(NdefRecord[] records) {
        List<ParsedNdefRecord> elements = new ArrayList<>();

        for (final NdefRecord record : records) {
            elements.add(new ParsedNdefRecord() {
                public String str() {
                    return new String(record.getPayload());
                }
            });
        }

        return elements;
    }
}
